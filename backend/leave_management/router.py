from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def get_all_leave_management():
    return {'message': 'Welcome to leave_management module'}
