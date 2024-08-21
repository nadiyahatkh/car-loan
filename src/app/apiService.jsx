const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchCar = async ({ token }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/car`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      const data = await response.json();
      return {
        data,
        message: "success"
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

//   API USER
  export const fetchApplicantUser = async ({token}) => {
    try {
    //   const statusParams = status.map(s => `status[]=${s}`).join('&');
        const response = await fetch(`${BASE_URL}/api/Applicant`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })
        .then((res) => res.json())
        .then((data) => {
         return {
          data: data,
          message: "successs"
         }
        })
        return response.data
      } catch (error) {
        console.error(error);
        return "abs";
      }
    };

    // API ADMIN
    export const fetchUsers = async ({token}) => {
        try {
          const response = await fetch(`${BASE_URL}/api/users`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          })
          .then((res) => res.json())
          .then((data) => {
           return {
            data: data,
            message: "successs"
           }
          })
          return response.data
        } catch (error) {
          console.error(error);
          return "abs"
        }
      };