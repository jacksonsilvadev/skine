const allSettled = async (promises) => {
    const results = await Promise.allSettled(promises)
  
    const successResults = results.filter((r) => r.status === 'fulfilled')
    const failedResults = results.filter((r) => r.status === 'rejected')
  
    return {
      success: successResults.map((r) => r.value),
      errors: failedResults.map((r) => r.reason),
    }
  }
  
  module.exports = {
    allSettled,
  }
  