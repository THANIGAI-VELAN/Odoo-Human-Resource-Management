from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def get_all_audit():
    return {'message': 'Welcome to audit module'}
