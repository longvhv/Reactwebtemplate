#!/bin/bash

# Generate Feature Script
# Creates boilerplate code for both Frontend and Backend

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if feature name is provided
if [ -z "$1" ]; then
    print_error "Feature name is required"
    echo "Usage: $0 <feature-name>"
    echo "Example: $0 product"
    exit 1
fi

FEATURE_NAME=$1
FEATURE_NAME_LOWER=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]')
FEATURE_NAME_UPPER=$(echo "$FEATURE_NAME" | tr '[:lower:]' '[:upper:]')
FEATURE_NAME_CAMEL=$(echo "$FEATURE_NAME" | sed 's/\b\(.\)/\u\1/g')

print_info "Generating feature: ${FEATURE_NAME}"
echo ""

# ============================================
# BACKEND (Golang)
# ============================================

print_info "🔧 Generating Backend files..."

BACKEND_DIR="golang-backend/internal/${FEATURE_NAME_LOWER}"
mkdir -p "$BACKEND_DIR"

# 1. Models
print_info "Creating models.go..."
cat > "${BACKEND_DIR}/models.go" << EOF
package ${FEATURE_NAME_LOWER}

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ${FEATURE_NAME_CAMEL} represents a ${FEATURE_NAME_LOWER} entity
type ${FEATURE_NAME_CAMEL} struct {
	ID            primitive.ObjectID \`json:"id" bson:"_id,omitempty"\`
	${FEATURE_NAME_CAMEL}ID  string            \`json:"${FEATURE_NAME_LOWER}Id" bson:"${FEATURE_NAME_LOWER}Id"\`
	Name          string            \`json:"name" bson:"name"\`
	Description   string            \`json:"description" bson:"description"\`
	Status        string            \`json:"status" bson:"status"\`
	CreatedAt     time.Time         \`json:"createdAt" bson:"createdAt"\`
	UpdatedAt     time.Time         \`json:"updatedAt" bson:"updatedAt"\`
}

// Create${FEATURE_NAME_CAMEL}Request represents create request
type Create${FEATURE_NAME_CAMEL}Request struct {
	Name        string \`json:"name" validate:"required"\`
	Description string \`json:"description"\`
	Status      string \`json:"status"\`
}

// Update${FEATURE_NAME_CAMEL}Request represents update request
type Update${FEATURE_NAME_CAMEL}Request struct {
	Name        string \`json:"name"\`
	Description string \`json:"description"\`
	Status      string \`json:"status"\`
}

// ${FEATURE_NAME_CAMEL}Response represents API response
type ${FEATURE_NAME_CAMEL}Response struct {
	${FEATURE_NAME_CAMEL}ID  string    \`json:"${FEATURE_NAME_LOWER}Id"\`
	Name          string    \`json:"name"\`
	Description   string    \`json:"description"\`
	Status        string    \`json:"status"\`
	CreatedAt     time.Time \`json:"createdAt"\`
	UpdatedAt     time.Time \`json:"updatedAt"\`
}

// List${FEATURE_NAME_CAMEL}sParams represents list query parameters
type List${FEATURE_NAME_CAMEL}sParams struct {
	Page      int    \`form:"page" binding:"min=1"\`
	PageSize  int    \`form:"pageSize" binding:"min=1,max=100"\`
	SortBy    string \`form:"sortBy"\`
	SortOrder string \`form:"sortOrder" binding:"oneof=asc desc"\`
	Search    string \`form:"search"\`
	Status    string \`form:"status"\`
}
EOF
print_success "Created models.go"

# 2. Repository
print_info "Creating repository.go..."
cat > "${BACKEND_DIR}/repository.go" << EOF
package ${FEATURE_NAME_LOWER}

import (
	"context"
	"errors"
	"time"

	"github.com/vhvplatform/go-shared/mongodb"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Repository handles database operations for ${FEATURE_NAME_LOWER}
type Repository struct {
	db     *mongo.Database
	items  *mongodb.Repository
}

// NewRepository creates a new ${FEATURE_NAME_LOWER} repository
func NewRepository(db *mongo.Database) *Repository {
	return &Repository{
		db:    db,
		items: mongodb.NewRepository(db, "${FEATURE_NAME_LOWER}s"),
	}
}

// Create creates a new ${FEATURE_NAME_LOWER}
func (r *Repository) Create(ctx context.Context, item *${FEATURE_NAME_CAMEL}) error {
	item.ID = primitive.NewObjectID()
	item.CreatedAt = time.Now()
	item.UpdatedAt = time.Now()

	_, err := r.items.InsertOne(ctx, item)
	return err
}

// FindByID finds a ${FEATURE_NAME_LOWER} by ID
func (r *Repository) FindByID(ctx context.Context, ${FEATURE_NAME_LOWER}ID string) (*${FEATURE_NAME_CAMEL}, error) {
	var item ${FEATURE_NAME_CAMEL}
	err := r.items.FindOne(ctx, bson.M{"${FEATURE_NAME_LOWER}Id": ${FEATURE_NAME_LOWER}ID}, &item)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &item, nil
}

// Update updates a ${FEATURE_NAME_LOWER}
func (r *Repository) Update(ctx context.Context, ${FEATURE_NAME_LOWER}ID string, update bson.M) (*${FEATURE_NAME_CAMEL}, error) {
	update["updatedAt"] = time.Now()

	var item ${FEATURE_NAME_CAMEL}
	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)

	err := r.items.Collection().FindOneAndUpdate(
		ctx,
		bson.M{"${FEATURE_NAME_LOWER}Id": ${FEATURE_NAME_LOWER}ID},
		bson.M{"\\\$set": update},
		opts,
	).Decode(&item)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}

	return &item, nil
}

// Delete deletes a ${FEATURE_NAME_LOWER}
func (r *Repository) Delete(ctx context.Context, ${FEATURE_NAME_LOWER}ID string) error {
	_, err := r.items.DeleteOne(ctx, bson.M{"${FEATURE_NAME_LOWER}Id": ${FEATURE_NAME_LOWER}ID})
	return err
}

// List returns a paginated list of ${FEATURE_NAME_LOWER}s
func (r *Repository) List(ctx context.Context, params *List${FEATURE_NAME_CAMEL}sParams) ([]${FEATURE_NAME_CAMEL}, int64, error) {
	// Build filter
	filter := bson.M{}

	if params.Search != "" {
		filter["\\\$or"] = []bson.M{
			{"name": bson.M{"\\\$regex": params.Search, "\\\$options": "i"}},
			{"description": bson.M{"\\\$regex": params.Search, "\\\$options": "i"}},
		}
	}

	if params.Status != "" {
		filter["status"] = params.Status
	}

	// Count total
	total, err := r.items.Count(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	// Build options
	opts := options.Find()

	sortOrder := 1
	if params.SortOrder == "desc" {
		sortOrder = -1
	}
	opts.SetSort(bson.D{{Key: params.SortBy, Value: sortOrder}})

	skip := int64((params.Page - 1) * params.PageSize)
	opts.SetSkip(skip)
	opts.SetLimit(int64(params.PageSize))

	// Find items
	var items []${FEATURE_NAME_CAMEL}
	err = r.items.Find(ctx, filter, &items, opts)
	if err != nil {
		return nil, 0, err
	}

	return items, total, nil
}

// Exists checks if a ${FEATURE_NAME_LOWER} exists
func (r *Repository) Exists(ctx context.Context, ${FEATURE_NAME_LOWER}ID string) (bool, error) {
	count, err := r.items.Count(ctx, bson.M{"${FEATURE_NAME_LOWER}Id": ${FEATURE_NAME_LOWER}ID})
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
EOF
print_success "Created repository.go"

# 3. Service
print_info "Creating service.go..."
cat > "${BACKEND_DIR}/service.go" << EOF
package ${FEATURE_NAME_LOWER}

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

var (
	Err${FEATURE_NAME_CAMEL}NotFound = errors.New("${FEATURE_NAME_LOWER} not found")
)

// Service handles business logic for ${FEATURE_NAME_LOWER}
type Service struct {
	repo *Repository
}

// NewService creates a new ${FEATURE_NAME_LOWER} service
func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

// Create creates a new ${FEATURE_NAME_LOWER}
func (s *Service) Create(ctx context.Context, req *Create${FEATURE_NAME_CAMEL}Request) (*${FEATURE_NAME_CAMEL}Response, error) {
	item := &${FEATURE_NAME_CAMEL}{
		${FEATURE_NAME_CAMEL}ID:  "${FEATURE_NAME_LOWER}_" + uuid.New().String()[:8],
		Name:          req.Name,
		Description:   req.Description,
		Status:        req.Status,
	}

	if item.Status == "" {
		item.Status = "active"
	}

	if err := s.repo.Create(ctx, item); err != nil {
		return nil, err
	}

	return s.toResponse(item), nil
}

// GetByID retrieves a ${FEATURE_NAME_LOWER} by ID
func (s *Service) GetByID(ctx context.Context, ${FEATURE_NAME_LOWER}ID string) (*${FEATURE_NAME_CAMEL}Response, error) {
	item, err := s.repo.FindByID(ctx, ${FEATURE_NAME_LOWER}ID)
	if err != nil {
		return nil, err
	}

	if item == nil {
		return nil, Err${FEATURE_NAME_CAMEL}NotFound
	}

	return s.toResponse(item), nil
}

// Update updates a ${FEATURE_NAME_LOWER}
func (s *Service) Update(ctx context.Context, ${FEATURE_NAME_LOWER}ID string, req *Update${FEATURE_NAME_CAMEL}Request) (*${FEATURE_NAME_CAMEL}Response, error) {
	update := bson.M{}

	if req.Name != "" {
		update["name"] = req.Name
	}
	if req.Description != "" {
		update["description"] = req.Description
	}
	if req.Status != "" {
		update["status"] = req.Status
	}

	item, err := s.repo.Update(ctx, ${FEATURE_NAME_LOWER}ID, update)
	if err != nil {
		return nil, err
	}

	if item == nil {
		return nil, Err${FEATURE_NAME_CAMEL}NotFound
	}

	return s.toResponse(item), nil
}

// Delete deletes a ${FEATURE_NAME_LOWER}
func (s *Service) Delete(ctx context.Context, ${FEATURE_NAME_LOWER}ID string) error {
	exists, err := s.repo.Exists(ctx, ${FEATURE_NAME_LOWER}ID)
	if err != nil {
		return err
	}

	if !exists {
		return Err${FEATURE_NAME_CAMEL}NotFound
	}

	return s.repo.Delete(ctx, ${FEATURE_NAME_LOWER}ID)
}

// List returns a paginated list of ${FEATURE_NAME_LOWER}s
func (s *Service) List(ctx context.Context, params *List${FEATURE_NAME_CAMEL}sParams) ([]${FEATURE_NAME_CAMEL}Response, int64, error) {
	// Set defaults
	if params.Page == 0 {
		params.Page = 1
	}
	if params.PageSize == 0 {
		params.PageSize = 20
	}
	if params.SortBy == "" {
		params.SortBy = "createdAt"
	}
	if params.SortOrder == "" {
		params.SortOrder = "desc"
	}

	items, total, err := s.repo.List(ctx, params)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]${FEATURE_NAME_CAMEL}Response, len(items))
	for i, item := range items {
		responses[i] = *s.toResponse(&item)
	}

	return responses, total, nil
}

// toResponse converts entity to response
func (s *Service) toResponse(item *${FEATURE_NAME_CAMEL}) *${FEATURE_NAME_CAMEL}Response {
	return &${FEATURE_NAME_CAMEL}Response{
		${FEATURE_NAME_CAMEL}ID:  item.${FEATURE_NAME_CAMEL}ID,
		Name:          item.Name,
		Description:   item.Description,
		Status:        item.Status,
		CreatedAt:     item.CreatedAt,
		UpdatedAt:     item.UpdatedAt,
	}
}
EOF
print_success "Created service.go"

# 4. Handler
print_info "Creating handler.go..."
cat > "${BACKEND_DIR}/handler.go" << EOF
package ${FEATURE_NAME_LOWER}

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for ${FEATURE_NAME_LOWER}
type Handler struct {
	service *Service
}

// NewHandler creates a new ${FEATURE_NAME_LOWER} handler
func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// Create handles create ${FEATURE_NAME_LOWER} request
// @Summary Create ${FEATURE_NAME_LOWER}
// @Description Create a new ${FEATURE_NAME_LOWER}
// @Tags ${FEATURE_NAME_LOWER}
// @Accept json
// @Produce json
// @Param request body Create${FEATURE_NAME_CAMEL}Request true "Create ${FEATURE_NAME_LOWER} request"
// @Success 201 {object} ${FEATURE_NAME_CAMEL}Response
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /api/v1/${FEATURE_NAME_LOWER}s [post]
func (h *Handler) Create(c *gin.Context) {
	var req Create${FEATURE_NAME_CAMEL}Request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.service.Create(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, resp)
}

// GetByID handles get ${FEATURE_NAME_LOWER} by ID request
// @Summary Get ${FEATURE_NAME_LOWER} by ID
// @Description Get a ${FEATURE_NAME_LOWER} by ID
// @Tags ${FEATURE_NAME_LOWER}
// @Produce json
// @Param id path string true "${FEATURE_NAME_CAMEL} ID"
// @Success 200 {object} ${FEATURE_NAME_CAMEL}Response
// @Failure 404 {object} map[string]string
// @Router /api/v1/${FEATURE_NAME_LOWER}s/{id} [get]
func (h *Handler) GetByID(c *gin.Context) {
	${FEATURE_NAME_LOWER}ID := c.Param("id")

	resp, err := h.service.GetByID(c.Request.Context(), ${FEATURE_NAME_LOWER}ID)
	if err != nil {
		if err == Err${FEATURE_NAME_CAMEL}NotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "${FEATURE_NAME_LOWER} not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// Update handles update ${FEATURE_NAME_LOWER} request
// @Summary Update ${FEATURE_NAME_LOWER}
// @Description Update a ${FEATURE_NAME_LOWER}
// @Tags ${FEATURE_NAME_LOWER}
// @Accept json
// @Produce json
// @Param id path string true "${FEATURE_NAME_CAMEL} ID"
// @Param request body Update${FEATURE_NAME_CAMEL}Request true "Update ${FEATURE_NAME_LOWER} request"
// @Success 200 {object} ${FEATURE_NAME_CAMEL}Response
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /api/v1/${FEATURE_NAME_LOWER}s/{id} [put]
func (h *Handler) Update(c *gin.Context) {
	${FEATURE_NAME_LOWER}ID := c.Param("id")

	var req Update${FEATURE_NAME_CAMEL}Request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.service.Update(c.Request.Context(), ${FEATURE_NAME_LOWER}ID, &req)
	if err != nil {
		if err == Err${FEATURE_NAME_CAMEL}NotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "${FEATURE_NAME_LOWER} not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// Delete handles delete ${FEATURE_NAME_LOWER} request
// @Summary Delete ${FEATURE_NAME_LOWER}
// @Description Delete a ${FEATURE_NAME_LOWER}
// @Tags ${FEATURE_NAME_LOWER}
// @Param id path string true "${FEATURE_NAME_CAMEL} ID"
// @Success 200 {object} map[string]bool
// @Failure 404 {object} map[string]string
// @Router /api/v1/${FEATURE_NAME_LOWER}s/{id} [delete]
func (h *Handler) Delete(c *gin.Context) {
	${FEATURE_NAME_LOWER}ID := c.Param("id")

	err := h.service.Delete(c.Request.Context(), ${FEATURE_NAME_LOWER}ID)
	if err != nil {
		if err == Err${FEATURE_NAME_CAMEL}NotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "${FEATURE_NAME_LOWER} not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

// List handles list ${FEATURE_NAME_LOWER}s request
// @Summary List ${FEATURE_NAME_LOWER}s
// @Description Get a paginated list of ${FEATURE_NAME_LOWER}s
// @Tags ${FEATURE_NAME_LOWER}
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param pageSize query int false "Page size" default(20)
// @Param sortBy query string false "Sort by field" default(createdAt)
// @Param sortOrder query string false "Sort order" Enums(asc, desc) default(desc)
// @Param search query string false "Search term"
// @Param status query string false "Filter by status"
// @Success 200 {object} map[string]interface{}
// @Router /api/v1/${FEATURE_NAME_LOWER}s [get]
func (h *Handler) List(c *gin.Context) {
	var params List${FEATURE_NAME_CAMEL}sParams
	if err := c.ShouldBindQuery(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	items, total, err := h.service.List(c.Request.Context(), &params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"items": items,
		"total": total,
		"page":  params.Page,
		"pageSize": params.PageSize,
	})
}
EOF
print_success "Created handler.go"

echo ""
print_success "Backend files created successfully!"
print_info "Location: ${BACKEND_DIR}"
echo ""

# ============================================
# FRONTEND (React + TypeScript)
# ============================================

print_info "🎨 Generating Frontend files..."

# 1. Types
TYPES_DIR="src/types"
mkdir -p "$TYPES_DIR"

print_info "Creating ${FEATURE_NAME_LOWER}.types.ts..."
cat > "${TYPES_DIR}/${FEATURE_NAME_LOWER}.types.ts" << EOF
export interface ${FEATURE_NAME_CAMEL} {
  ${FEATURE_NAME_LOWER}Id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Create${FEATURE_NAME_CAMEL}Request {
  name: string;
  description?: string;
  status?: string;
}

export interface Update${FEATURE_NAME_CAMEL}Request {
  name?: string;
  description?: string;
  status?: string;
}

export interface List${FEATURE_NAME_CAMEL}sParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: string;
}

export interface ${FEATURE_NAME_CAMEL}Response {
  items: ${FEATURE_NAME_CAMEL}[];
  total: number;
  page: number;
  pageSize: number;
}
EOF
print_success "Created ${FEATURE_NAME_LOWER}.types.ts"

# 2. Service
SERVICES_DIR="src/services"
mkdir -p "$SERVICES_DIR"

print_info "Creating ${FEATURE_NAME_LOWER}.service.ts..."
cat > "${SERVICES_DIR}/${FEATURE_NAME_LOWER}.service.ts" << EOF
import api from './api';
import type {
  ${FEATURE_NAME_CAMEL},
  Create${FEATURE_NAME_CAMEL}Request,
  Update${FEATURE_NAME_CAMEL}Request,
  List${FEATURE_NAME_CAMEL}sParams,
  ${FEATURE_NAME_CAMEL}Response,
} from '../types/${FEATURE_NAME_LOWER}.types';

export const ${FEATURE_NAME_LOWER}Service = {
  /**
   * Create a new ${FEATURE_NAME_LOWER}
   */
  create: async (data: Create${FEATURE_NAME_CAMEL}Request): Promise<${FEATURE_NAME_CAMEL}> => {
    const response = await api.post('/${FEATURE_NAME_LOWER}s', data);
    return response.data;
  },

  /**
   * Get ${FEATURE_NAME_LOWER} by ID
   */
  getById: async (${FEATURE_NAME_LOWER}Id: string): Promise<${FEATURE_NAME_CAMEL}> => {
    const response = await api.get(\`/${FEATURE_NAME_LOWER}s/\${${FEATURE_NAME_LOWER}Id}\`);
    return response.data;
  },

  /**
   * List ${FEATURE_NAME_LOWER}s with pagination
   */
  list: async (params: List${FEATURE_NAME_CAMEL}sParams = {}): Promise<${FEATURE_NAME_CAMEL}Response> => {
    const response = await api.get('/${FEATURE_NAME_LOWER}s', { params });
    return response.data;
  },

  /**
   * Update ${FEATURE_NAME_LOWER}
   */
  update: async (
    ${FEATURE_NAME_LOWER}Id: string,
    data: Update${FEATURE_NAME_CAMEL}Request
  ): Promise<${FEATURE_NAME_CAMEL}> => {
    const response = await api.put(\`/${FEATURE_NAME_LOWER}s/\${${FEATURE_NAME_LOWER}Id}\`, data);
    return response.data;
  },

  /**
   * Delete ${FEATURE_NAME_LOWER}
   */
  delete: async (${FEATURE_NAME_LOWER}Id: string): Promise<void> => {
    await api.delete(\`/${FEATURE_NAME_LOWER}s/\${${FEATURE_NAME_LOWER}Id}\`);
  },
};
EOF
print_success "Created ${FEATURE_NAME_LOWER}.service.ts"

# 3. Component
COMPONENTS_DIR="src/components/${FEATURE_NAME_LOWER}"
mkdir -p "$COMPONENTS_DIR"

print_info "Creating ${FEATURE_NAME_CAMEL}List.tsx..."
cat > "${COMPONENTS_DIR}/${FEATURE_NAME_CAMEL}List.tsx" << EOF
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ${FEATURE_NAME_LOWER}Service } from '../../services/${FEATURE_NAME_LOWER}.service';
import type { ${FEATURE_NAME_CAMEL} } from '../../types/${FEATURE_NAME_LOWER}.types';

export function ${FEATURE_NAME_CAMEL}List() {
  const { t } = useTranslation();
  const [${FEATURE_NAME_LOWER}s, set${FEATURE_NAME_CAMEL}s] = useState<${FEATURE_NAME_CAMEL}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load${FEATURE_NAME_CAMEL}s();
  }, []);

  const load${FEATURE_NAME_CAMEL}s = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ${FEATURE_NAME_LOWER}Service.list();
      set${FEATURE_NAME_CAMEL}s(response.items);
    } catch (err) {
      setError(t('${FEATURE_NAME_LOWER}.errors.loadFailed'));
      console.error('Failed to load ${FEATURE_NAME_LOWER}s:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (${FEATURE_NAME_LOWER}Id: string) => {
    if (!confirm(t('${FEATURE_NAME_LOWER}.confirmDelete'))) return;

    try {
      await ${FEATURE_NAME_LOWER}Service.delete(${FEATURE_NAME_LOWER}Id);
      load${FEATURE_NAME_CAMEL}s();
    } catch (err) {
      setError(t('${FEATURE_NAME_LOWER}.errors.deleteFailed'));
      console.error('Failed to delete ${FEATURE_NAME_LOWER}:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('${FEATURE_NAME_LOWER}.title')}</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          {t('${FEATURE_NAME_LOWER}.create')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('${FEATURE_NAME_LOWER}.fields.name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('${FEATURE_NAME_LOWER}.fields.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {${FEATURE_NAME_LOWER}s.map((${FEATURE_NAME_LOWER}) => (
              <tr key={${FEATURE_NAME_LOWER}.${FEATURE_NAME_LOWER}Id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {${FEATURE_NAME_LOWER}.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {${FEATURE_NAME_LOWER}.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    {t('common.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(${FEATURE_NAME_LOWER}.${FEATURE_NAME_LOWER}Id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    {t('common.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {${FEATURE_NAME_LOWER}s.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {t('${FEATURE_NAME_LOWER}.noData')}
          </div>
        )}
      </div>
    </div>
  );
}
EOF
print_success "Created ${FEATURE_NAME_CAMEL}List.tsx"

# 4. Translations template
print_info "Creating translation template..."
cat > "${COMPONENTS_DIR}/translations-template.json" << EOF
{
  "${FEATURE_NAME_LOWER}": {
    "title": "Replace with translated title",
    "create": "Replace with 'Create' translation",
    "edit": "Replace with 'Edit' translation",
    "delete": "Replace with 'Delete' translation",
    "confirmDelete": "Replace with delete confirmation message",
    "noData": "Replace with 'No data' message",
    "fields": {
      "name": "Replace with 'Name' translation",
      "description": "Replace with 'Description' translation",
      "status": "Replace with 'Status' translation"
    },
    "errors": {
      "loadFailed": "Replace with error message",
      "createFailed": "Replace with error message",
      "updateFailed": "Replace with error message",
      "deleteFailed": "Replace with error message"
    }
  }
}

Add this to:
- src/i18n/locales/vi.json
- src/i18n/locales/en.json
- src/i18n/locales/es.json
- src/i18n/locales/fr.json
- src/i18n/locales/zh.json
- src/i18n/locales/ja.json
- src/i18n/locales/ko.json
EOF
print_success "Created translations template"

echo ""
print_success "Frontend files created successfully!"
print_info "Location: ${TYPES_DIR}, ${SERVICES_DIR}, ${COMPONENTS_DIR}"
echo ""

# ============================================
# SUMMARY
# ============================================

print_success "✨ Feature generation complete!"
echo ""
echo "📁 Backend files created:"
echo "   - ${BACKEND_DIR}/models.go"
echo "   - ${BACKEND_DIR}/repository.go"
echo "   - ${BACKEND_DIR}/service.go"
echo "   - ${BACKEND_DIR}/handler.go"
echo ""
echo "📁 Frontend files created:"
echo "   - ${TYPES_DIR}/${FEATURE_NAME_LOWER}.types.ts"
echo "   - ${SERVICES_DIR}/${FEATURE_NAME_LOWER}.service.ts"
echo "   - ${COMPONENTS_DIR}/${FEATURE_NAME_CAMEL}List.tsx"
echo "   - ${COMPONENTS_DIR}/translations-template.json"
echo ""
print_info "📝 Next steps:"
echo "   1. Register routes in golang-backend/cmd/api/main.go"
echo "   2. Add translations to all 7 language files"
echo "   3. Write tests (repository_test.go, service_test.go)"
echo "   4. Update API documentation"
echo "   5. Test the feature end-to-end"
echo ""
print_info "📖 See FEATURE_SYNC.md for complete workflow"
