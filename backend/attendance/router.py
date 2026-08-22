from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def get_all_attendance():
    return {'message': 'Welcome to attendance module'}
