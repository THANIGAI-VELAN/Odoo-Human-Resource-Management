from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def get_all_holidays():
    return {'message': 'Welcome to holidays module'}
