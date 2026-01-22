package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"vhvplatform/models"
	"vhvplatform/services"
	"vhvplatform/utils"
)

// TestcasesHandler handles HTTP requests for testcases
type TestcasesHandler struct {
	service *services.TestcasesService
}

// NewTestcasesHandler creates a new testcases handler
func NewTestcasesHandler(service *services.TestcasesService) *TestcasesHandler {
	return &TestcasesHandler{
		service: service,
	}
}

// GetAllTestcases handles GET /api/v1/testcases
func (h *TestcasesHandler) GetAllTestcases(w http.ResponseWriter, r *http.Request) {
	// Parse query parameters
	query := r.URL.Query()
	
	filters := models.TestcaseFilters{
		Category: query.Get("category"),
		Status:   query.Get("status"),
		Priority: query.Get("priority"),
		Search:   query.Get("search"),
	}

	// Pagination
	page, _ := strconv.Atoi(query.Get("page"))
	if page < 1 {
		page = 1
	}

	limit, _ := strconv.Atoi(query.Get("limit"))
	if limit < 1 || limit > 100 {
		limit = 20
	}

	// Get testcases from service
	result, err := h.service.GetAllTestcases(filters, page, limit)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "DATABASE_ERROR", err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    result,
		"message": "Testcases retrieved successfully",
	})
}

// GetTestcaseByID handles GET /api/v1/testcases/:id
func (h *TestcasesHandler) GetTestcaseByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	testcase, err := h.service.GetTestcaseByID(id)
	if err != nil {
		utils.RespondError(w, http.StatusNotFound, "TESTCASE_NOT_FOUND", "Testcase not found")
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    testcase,
		"message": "Testcase retrieved successfully",
	})
}

// CreateTestcase handles POST /api/v1/testcases
func (h *TestcasesHandler) CreateTestcase(w http.ResponseWriter, r *http.Request) {
	var testcase models.Testcase

	// Decode request body
	if err := json.NewDecoder(r.Body).Decode(&testcase); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body")
		return
	}

	// Validate testcase
	if err := testcase.Validate(); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
		return
	}

	// Create testcase
	created, err := h.service.CreateTestcase(&testcase)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "DATABASE_ERROR", err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusCreated, map[string]interface{}{
		"success": true,
		"data":    created,
		"message": "Testcase created successfully",
	})
}

// UpdateTestcase handles PUT /api/v1/testcases/:id
func (h *TestcasesHandler) UpdateTestcase(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var updates map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "INVALID_REQUEST", "Invalid request body")
		return
	}

	// Update testcase
	updated, err := h.service.UpdateTestcase(id, updates)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "DATABASE_ERROR", err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    updated,
		"message": "Testcase updated successfully",
	})
}

// DeleteTestcase handles DELETE /api/v1/testcases/:id
func (h *TestcasesHandler) DeleteTestcase(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	// Soft delete
	if err := h.service.DeleteTestcase(id); err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "DATABASE_ERROR", err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"message": "Testcase deleted successfully",
	})
}

// ExportToExcel handles GET /api/v1/testcases/export/excel
func (h *TestcasesHandler) ExportToExcel(w http.ResponseWriter, r *http.Request) {
	// Parse filters (same as GetAllTestcases)
	query := r.URL.Query()
	filters := models.TestcaseFilters{
		Category: query.Get("category"),
		Status:   query.Get("status"),
		Priority: query.Get("priority"),
		Search:   query.Get("search"),
	}

	// Generate Excel file
	excelFile, err := h.service.ExportToExcel(filters)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "EXPORT_ERROR", err.Error())
		return
	}

	// Set headers for file download
	filename := "Testcase_" + utils.GetCurrentDate() + ".xlsx"
	w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	w.Header().Set("Content-Disposition", "attachment; filename=\""+filename+"\"")
	
	// Write file to response
	w.Write(excelFile)
}

// GetStatistics handles GET /api/v1/testcases/statistics
func (h *TestcasesHandler) GetStatistics(w http.ResponseWriter, r *http.Request) {
	stats, err := h.service.GetStatistics()
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "DATABASE_ERROR", err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"data":    stats,
		"message": "Statistics retrieved successfully",
	})
}

// RegisterRoutes registers all testcase routes
func (h *TestcasesHandler) RegisterRoutes(router *mux.Router) {
	// Public routes (if any)
	
	// Protected routes (require authentication)
	api := router.PathPrefix("/api/v1").Subrouter()
	
	// Apply authentication middleware
	// api.Use(middleware.AuthMiddleware)
	
	api.HandleFunc("/testcases", h.GetAllTestcases).Methods("GET")
	api.HandleFunc("/testcases/{id}", h.GetTestcaseByID).Methods("GET")
	api.HandleFunc("/testcases", h.CreateTestcase).Methods("POST")
	api.HandleFunc("/testcases/{id}", h.UpdateTestcase).Methods("PUT")
	api.HandleFunc("/testcases/{id}", h.DeleteTestcase).Methods("DELETE")
	api.HandleFunc("/testcases/export/excel", h.ExportToExcel).Methods("GET")
	api.HandleFunc("/testcases/statistics", h.GetStatistics).Methods("GET")
}
