import axios from 'axios';

const instance = axios.create({
    baseURL:'https://audioannotation.ivechain.com'
    // baseURL:'http://127.0.0.1:5555/'
});


export default {

    getTextList(limit=3,excludes=null){
        return instance.post('api/text/textList',{limit:limit,excludes:excludes})
    },
    uploadAudios(data){
        return instance.post('api/audio/uploadAudio',data,)
    },
    login(data){
        return instance.post('api/login',data,)
    },
    register(data){
        return instance.post('api/register',data,)
    },
    queryCount(data){
        return instance.post('api/queryCount',data,)
    }
}