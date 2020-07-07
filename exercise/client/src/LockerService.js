import axios from 'axios'

const url = 'api/lockers/';

class LockerService {
    // get lockings
    static getLockings() {
        return new Promise((resolve, reject) =>  {
            axios.get(url).then((res) => {
                const data = res.data;
                resolve(
                    data.map(locking => ({
                        ...locking,
                    }))
                );
            })
            .catch((err)=> {
                reject(err);
            })
        })
    }
    //create lockings
    static updateLocking(id, unit,size,firstprice,nextprice,status,payment,password) {
        return axios.put(`${url}${id}`, {
            unit: unit,
            size: size,
            firstprice: firstprice,
            nextprice: nextprice,
            status: status,
            payment: payment,
            password: password,
        })
    }
    //delete locking
    static deleteLocking(id) {
        return axios.delete(`${url}${id}`)
    }
    //get locking by id
    static getLockingById(id) {
        return axios.get(`${url}${id}`)
    }
}
export default LockerService;