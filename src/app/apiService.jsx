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
    export const fetchApplicantAdmin = async ({token}) => {
        try {
            const response = await fetch(`${BASE_URL}/api/data/applicants`, {
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
    
        export const acceptApplicant = async ({ id, token }) => {
            const response = await fetch(`${BASE_URL}/api/Applicant/accepted/${id}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Tambahkan Content-Type jika diperlukan
              },
            });
          
            if (!response.ok) {
              throw new Error('Failed to accept applicant');
            }
          
            // Coba respons sebagai teks terlebih dahulu untuk memeriksa apakah kosong
            const textResponse = await response.text();
          
            if (textResponse === '') {
              // Respons kosong, mungkin Anda ingin mengembalikan sesuatu yang lain
              throw new Error('Empty response');
            }
          
            // Parse respons sebagai JSON
            return JSON.parse(textResponse);
          };
          

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

      export const removeUsers = async ({ id, token }) => {
        
        try {
          const response = await fetch(`${BASE_URL}/api/users/delete/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to remove item');
          }
          return await response.json();
        } catch (error) {
          console.error('Error removing item:', error);
        }
      };