from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def get_all_recruitment():
    return {'message': 'Welcome to recruitment module'}
