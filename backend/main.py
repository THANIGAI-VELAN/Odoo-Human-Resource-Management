from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from config.database import init_db

# Lifespan/startup DB generation
def create_tables():
    init_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_tables()

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to ProHRMS API", "docs": f"{settings.API_V1_STR}/docs"}

# Feature routers will be mounted here
from authentication.router import router as auth_router
from employees.router import router as emp_router

app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["authentication"])
app.include_router(emp_router, prefix=f"{settings.API_V1_STR}/employees", tags=["employees"])
