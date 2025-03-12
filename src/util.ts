export function handleError(error: any) {
  if (error.response) {
    console.error('Error response:', error.response.data);
    return error.response.data;
  } else {
    console.error('Error message:', error.message);
    throw error.message; 
  }
}