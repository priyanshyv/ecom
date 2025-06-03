export function createOrder(order) {
  return new Promise(async (resolve) =>{
    const response = await fetch('http://localhost:8080/orders',{
      method:'POST',
      body: JSON.stringify(order),
      headers:{'content-type':'application/json'}
    })
    const data=await response.json();
    //TODO : on server it will only return some info of user(not password)
    resolve({data});
  }
  );
}
export function fetchAllOrders(pagination) {
  let queryString = '';
  for(let key in filter){
    const categoryValues = filter[key];
    if(categoryValues.length){
      const lastCategoryValue = categoryValues[categoryValues.length-1]
      queryString += `${key}=${lastCategoryValue}&`
    }
  }
  for(let key in sort){
    queryString += `${key}=${sort[key]}&`
  }
  console.log(pagination)
  for(let key in pagination){
    queryString += `${key}=${pagination[key]}&`
  }


  return new Promise(async (resolve) =>{
    //TODO: we will not hard-code server URL here
    const response = await fetch('http://localhost:8080/orders?'+queryString) 
    const data = await response.json()
    const totalOrders = await response.headers.get('X-Total-Count')
    resolve({data:{products:data,totalOrders:+totalOrders}})
  }
  );
}
