import axios from 'axios';

// axios를 사용할 때 앞에 domain부분을 지우면
// 현재 app이 띄워져 있는 주소의 domain을 사용함
export const getPosts = async() => {
    //const response = await axios.get('http://localhost:4000/posts');
    const response = await axios.get('/posts');
    return response.data;
};

export const getPostById = async(id) => {
    //const response = await axios.get(`http://localhost:4000/posts/${id}`);
    const response = await axios.get(`/posts/${id}`);
    return response.data;
};
