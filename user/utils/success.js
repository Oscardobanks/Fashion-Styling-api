export const CreateSuccess = (statusCode, statusMessage, data) => {
    const successObj = {
        status: statusCode,
        success: true,
        message: statusMessage,
        data: data
    }
    return successObj;
}