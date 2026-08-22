from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def get_all_payroll():
    return {'message': 'Welcome to payroll module'}
