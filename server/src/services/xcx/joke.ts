import { api } from '../../public/framework';
export async function list(page: number) {
  const uri = `http://api.tianapi.com/txapi/joke?key=2da20dd9e25d021652f1b5c913fde4f5&num=20`;
  try {
    const data = await api.get(
      uri,
      {},
      {
        parse: false,
      }
    );
    return data;
  } catch (err) {
    throw err;
  }
}
