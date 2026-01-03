# Feature Sync Guide - Frontend ↔️ Backend

Tài liệu hướng dẫn đồng bộ tính năng giữa React Frontend và Golang Backend API.

## 📋 Nguyên Tắc Đồng Bộ

> **QUAN TRỌNG**: Mọi tính năng mới phải được implement đồng thời cho cả Frontend và Backend.

### ✅ Checklist Khi Thêm Tính Năng Mới

```
□ Frontend (React + TypeScript)
  □ Components
  □ Services/API calls
  □ Types/Interfaces
  □ i18n translations (6 languages)
  □ Routes (if applicable)
  □ Tests

□ Backend (Golang)
  □ Models/Entities
  □ Repository layer
  □ Service layer
  □ HTTP Handlers
  □ Routes
  □ Tests
  □ API Documentation
```

---

## 🏗️ Kiến Trúc Đồng Bộ

### Frontend Structure
```
/src
├── components/        # React components
├── services/         # API client services
├── types/           # TypeScript types
├── hooks/           # Custom hooks
└── i18n/           # Translations (vi, en, es, fr, zh, ja, ko)
```

### Backend Structure
```
/golang-backend
├── internal/
│   ├── {feature}/
│   │   ├── models.go      # Data models
│   │   ├── repository.go  # DB layer
│   │   ├── service.go     # Business logic
│   │   └── handler.go     # HTTP handlers
├── pkg/              # Shared packages
└── migrations/       # Database migrations
```

---

## 🔄 Workflow Sync Feature

### 1️⃣ **Planning Phase**

**Frontend:**
- Define UI/UX requirements
- Design component structure
- Plan state management
- Define TypeScript interfaces

**Backend:**
- Design API endpoints
- Define data models
- Plan database schema
- Design business logic flow

### 2️⃣ **Implementation Phase**

**Step 1: Backend First (Recommended)**

```bash
# 1. Create models
/golang-backend/internal/{feature}/models.go

# 2. Create repository
/golang-backend/internal/{feature}/repository.go
/golang-backend/internal/{feature}/repository_test.go

# 3. Create service
/golang-backend/internal/{feature}/service.go
/golang-backend/internal/{feature}/service_test.go

# 4. Create handlers
/golang-backend/internal/{feature}/handler.go

# 5. Register routes
/golang-backend/cmd/api/main.go

# 6. Run tests
make test-{feature}
```

**Step 2: Frontend Implementation**

```bash
# 1. Create types
/src/types/{feature}.types.ts

# 2. Create services
/src/services/{feature}.service.ts

# 3. Create components
/src/components/{feature}/

# 4. Add translations
/src/i18n/locales/{lang}.json

# 5. Add routes
/src/App.tsx or routing config
```

### 3️⃣ **Testing Phase**

**Backend:**
```bash
make test-{feature}
make test-coverage
```

**Frontend:**
```bash
npm test
npm run test:coverage
```

**Integration:**
```bash
# Test API endpoints
curl http://localhost:8080/api/v1/{endpoint}

# Test Frontend
npm run dev
```

---

## 📝 Feature Template

### Backend Template

#### Models (`models.go`)
```go
package feature

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Feature represents a feature entity
type Feature struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	FeatureID string            `json:"featureId" bson:"featureId"`
	Name      string            `json:"name" bson:"name"`
	Status    string            `json:"status" bson:"status"`
	CreatedAt time.Time         `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time         `json:"updatedAt" bson:"updatedAt"`
}

// CreateFeatureRequest represents create request
type CreateFeatureRequest struct {
	Name   string `json:"name" validate:"required"`
	Status string `json:"status"`
}

// FeatureResponse represents API response
type FeatureResponse struct {
	FeatureID string    `json:"featureId"`
	Name      string    `json:"name"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
}
```

#### Repository (`repository.go`)
```go
package feature

import (
	"context"
	"github.com/vhvplatform/go-shared/mongodb"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type Repository struct {
	features *mongodb.Repository
}

func NewRepository(db *mongo.Database) *Repository {
	return &Repository{
		features: mongodb.NewRepository(db, "features"),
	}
}

func (r *Repository) Create(ctx context.Context, feature *Feature) error {
	_, err := r.features.InsertOne(ctx, feature)
	return err
}

func (r *Repository) FindByID(ctx context.Context, featureID string) (*Feature, error) {
	var feature Feature
	err := r.features.FindOne(ctx, bson.M{"featureId": featureID}, &feature)
	if err != nil {
		return nil, err
	}
	return &feature, nil
}
```

#### Service (`service.go`)
```go
package feature

import (
	"context"
	"errors"
	"time"
	"github.com/google/uuid"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Create(ctx context.Context, req *CreateFeatureRequest) (*FeatureResponse, error) {
	feature := &Feature{
		FeatureID: "feat_" + uuid.New().String()[:8],
		Name:      req.Name,
		Status:    req.Status,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := s.repo.Create(ctx, feature); err != nil {
		return nil, err
	}

	return s.toResponse(feature), nil
}

func (s *Service) toResponse(feature *Feature) *FeatureResponse {
	return &FeatureResponse{
		FeatureID: feature.FeatureID,
		Name:      feature.Name,
		Status:    feature.Status,
		CreatedAt: feature.CreatedAt,
	}
}
```

#### Handler (`handler.go`)
```go
package feature

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Create(c *gin.Context) {
	var req CreateFeatureRequest
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

func (h *Handler) GetByID(c *gin.Context) {
	featureID := c.Param("id")
	
	feature, err := h.service.GetByID(c.Request.Context(), featureID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "feature not found"})
		return
	}

	c.JSON(http.StatusOK, feature)
}
```

### Frontend Template

#### Types (`{feature}.types.ts`)
```typescript
export interface Feature {
  featureId: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFeatureRequest {
  name: string;
  status?: string;
}

export interface FeatureResponse {
  featureId: string;
  name: string;
  status: string;
  createdAt: string;
}

export interface ListFeaturesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}
```

#### Service (`{feature}.service.ts`)
```typescript
import api from './api';
import type { Feature, CreateFeatureRequest, FeatureResponse, ListFeaturesParams } from '../types/feature.types';

export const featureService = {
  create: async (data: CreateFeatureRequest): Promise<FeatureResponse> => {
    const response = await api.post('/features', data);
    return response.data;
  },

  getById: async (featureId: string): Promise<Feature> => {
    const response = await api.get(`/features/${featureId}`);
    return response.data;
  },

  list: async (params: ListFeaturesParams): Promise<{ features: Feature[]; total: number }> => {
    const response = await api.get('/features', { params });
    return response.data;
  },

  update: async (featureId: string, data: Partial<Feature>): Promise<Feature> => {
    const response = await api.put(`/features/${featureId}`, data);
    return response.data;
  },

  delete: async (featureId: string): Promise<void> => {
    await api.delete(`/features/${featureId}`);
  },
};
```

#### Component (`FeatureList.tsx`)
```typescript
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { featureService } from '../../services/feature.service';
import type { Feature } from '../../types/feature.types';

export function FeatureList() {
  const { t } = useTranslation();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      const { features } = await featureService.list({});
      setFeatures(features);
    } catch (error) {
      console.error('Failed to load features:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>{t('common.loading')}</div>;

  return (
    <div>
      <h1>{t('features.title')}</h1>
      <ul>
        {features.map(feature => (
          <li key={feature.featureId}>
            {feature.name} - {feature.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### Translations
```json
// vi.json
{
  "features": {
    "title": "Danh sách tính năng",
    "create": "Tạo tính năng",
    "name": "Tên",
    "status": "Trạng thái"
  }
}

// en.json
{
  "features": {
    "title": "Features List",
    "create": "Create Feature",
    "name": "Name",
    "status": "Status"
  }
}

// es.json, fr.json, zh.json, ja.json, ko.json...
```

---

## 🔗 API Endpoint Convention

### REST API Pattern

```
Method  Endpoint                      Description
------  --------------------------    ---------------------------
GET     /api/v1/{resource}           List all resources
GET     /api/v1/{resource}/:id       Get single resource
POST    /api/v1/{resource}           Create new resource
PUT     /api/v1/{resource}/:id       Update resource (full)
PATCH   /api/v1/{resource}/:id       Update resource (partial)
DELETE  /api/v1/{resource}/:id       Delete resource
```

### Example: User Feature

**Backend Routes:**
```go
// golang-backend/cmd/api/main.go
v1 := r.Group("/api/v1")
{
    users := v1.Group("/users")
    {
        users.GET("", userHandler.List)
        users.GET("/:id", userHandler.GetByID)
        users.POST("", userHandler.Create)
        users.PUT("/:id", userHandler.Update)
        users.DELETE("/:id", userHandler.Delete)
    }
}
```

**Frontend Service:**
```typescript
// src/services/user.service.ts
export const userService = {
  list: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id: string, data) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};
```

---

## 📊 Current Features Status

### ✅ Implemented (Synced)

| Feature | Backend | Frontend | Tests | Docs |
|---------|---------|----------|-------|------|
| Authentication | ✅ | ✅ | ✅ | ✅ |
| User Management | ✅ | ✅ | ✅ | ✅ |
| Platform Settings | ✅ | ⏳ | ✅ | ✅ |

### 🚧 In Progress

| Feature | Backend | Frontend | Tests | Docs |
|---------|---------|----------|-------|------|
| - | - | - | - | - |

### 📝 Planned

| Feature | Priority | Status |
|---------|----------|--------|
| - | - | - |

---

## 🛠️ Development Workflow

### 1. New Feature Request

```markdown
## Feature: [Feature Name]

### Description
Brief description of the feature

### Backend Requirements
- [ ] API endpoints
- [ ] Database models
- [ ] Business logic
- [ ] Tests

### Frontend Requirements
- [ ] Components
- [ ] Services
- [ ] Types
- [ ] Translations
- [ ] Tests

### API Specification
```yaml
POST /api/v1/resource
Request:
  {
    "field": "value"
  }
Response:
  {
    "id": "123",
    "field": "value"
  }
```
```

### 2. Implementation Order

1. **Backend First** (Recommended)
   - Design and implement API
   - Write tests
   - Document endpoints
   - Deploy to dev

2. **Frontend Integration**
   - Create types based on API
   - Implement services
   - Build components
   - Add translations
   - Test integration

3. **Review & Deploy**
   - Code review
   - Integration testing
   - Deploy both together

---

## 🔍 Testing Strategy

### Backend Testing
```bash
# Unit tests
make test-{feature}

# Integration tests
make test-integration

# Coverage
make test-coverage
```

### Frontend Testing
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### API Testing
```bash
# Manual testing
curl -X POST http://localhost:8080/api/v1/resource \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'

# Automated testing (Thunder Client, Postman, etc.)
```

---

## 📚 Documentation Requirements

### Backend
- ✅ Code comments
- ✅ API documentation (Swagger/OpenAPI)
- ✅ README in package
- ✅ Examples

### Frontend
- ✅ Component documentation
- ✅ JSDoc/TSDoc
- ✅ Storybook (optional)
- ✅ Usage examples

---

## 🚀 Deployment Checklist

### Before Deploy

```
□ Backend
  □ All tests passing
  □ Code reviewed
  □ Documentation updated
  □ Environment variables configured
  □ Database migrations ready

□ Frontend
  □ All tests passing
  □ Build succeeds
  □ Translations complete (6 languages)
  □ Code reviewed
  □ Environment variables configured

□ Integration
  □ API endpoints tested
  □ Frontend connects to API
  □ Authentication working
  □ Error handling tested
```

### Deploy Order

1. Deploy Backend first
2. Run database migrations
3. Test API endpoints
4. Deploy Frontend
5. Test full integration
6. Monitor logs

---

## 🔄 Maintenance

### Regular Sync Checks

```bash
# Weekly checks
□ Review pending features
□ Update documentation
□ Check test coverage
□ Review deprecated APIs
□ Update dependencies
```

### Version Compatibility

```
Backend API Version: v1
Frontend API Client: v1
Compatible: ✅

When breaking changes needed:
- Create new API version (v2)
- Maintain backward compatibility
- Deprecate old version gradually
```

---

## 📞 Communication

### When to Sync

- ✅ New feature added
- ✅ API endpoint changed
- ✅ Data model updated
- ✅ Authentication method changed
- ✅ Error handling updated

### How to Sync

1. Update Backend first
2. Update API documentation
3. Notify Frontend team
4. Update Frontend types
5. Update Frontend services
6. Test integration
7. Deploy together

---

## ⚡ Quick Reference

### Backend Commands
```bash
make test              # Run all tests
make test-{feature}    # Run feature tests
make build            # Build binary
make run              # Run server
make docker-build     # Build Docker image
```

### Frontend Commands
```bash
npm run dev           # Development server
npm test              # Run tests
npm run build         # Production build
npm run type-check    # TypeScript check
```

### Common Issues

**Issue: Type mismatch between Frontend and Backend**
```bash
# Solution: Update TypeScript types to match API response
# Always generate types from OpenAPI/Swagger if possible
```

**Issue: Translation missing**
```bash
# Solution: Add translation to all 6 language files
# vi.json, en.json, es.json, fr.json, zh.json, ja.json, ko.json
```

---

## 📝 Notes

- Always sync Backend and Frontend for new features
- Keep API versioned for backward compatibility
- Maintain 6 language translations
- Write tests for both layers
- Document everything
- Review before deploy

---

**Last Updated:** 2026-01-03
**Maintainer:** VHV Platform Team
