from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def get_all_shifts():
    return {'message': 'Welcome to shifts module'}
