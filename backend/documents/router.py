from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def get_all_documents():
    return {'message': 'Welcome to documents module'}
