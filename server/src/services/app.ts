export async function getUserName() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve({
        userName: 'api',
      });
    }, 100);
  });
}
