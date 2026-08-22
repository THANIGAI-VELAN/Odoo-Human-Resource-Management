from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def get_all_reports():
    return {'message': 'Welcome to reports module'}
