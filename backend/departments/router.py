from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def get_all_departments():
    return {'message': 'Welcome to departments module'}
