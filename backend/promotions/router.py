from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def get_all_promotions():
    return {'message': 'Welcome to promotions module'}
