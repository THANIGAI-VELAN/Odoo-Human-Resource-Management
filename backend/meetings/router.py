from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def get_all_meetings():
    return {'message': 'Welcome to meetings module'}
