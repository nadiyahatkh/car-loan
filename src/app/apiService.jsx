import { format } from "date-fns";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchNavbarProfile = async ({token}) => {
  try {
    const response = await fetch(`${BASE_URL}/api/navbar`, {
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
}

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
  export const fetchApplicantUser = async ({token, start_date, end_date, search, status, page, car_id}) => {
    try {
      const statusParams = status.map(s => `status[]=${s}`).join('&');
      let carUrl = ""
          if(car_id) {
            carUrl = `&car_id=${car_id}`
          }
        const response = await fetch(`${BASE_URL}/api/Applicant?search=${search}&start_date=${start_date}&end_date=${end_date}&${statusParams}&page=${page}${carUrl}`, {
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

    export const createApplicantUser = async ({ data, token }) => {
      try {
        const formData = new FormData();
        formData.append('purpose', data.purpose);
        formData.append('car_id', data.car_id);
        if (data.submission_date) {
          formData.append('submission_date', format(data.submission_date, "yyyy-MM-dd'T'HH:mm:ss"));
        }
        
        if (data.expiry_date) {
          formData.append('expiry_date', format(data.expiry_date, "yyyy-MM-dd'T'HH:mm:ss"));
        }
    
        const response = await fetch(`${BASE_URL}/api/Applicant/create`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
    
        if (!response.ok) {
          const result = await response.text();
          throw new Error(result);
        }
    
        const result = await response.json();
        return result;
      } catch (error) {
        console.log('Error creating applicant:', error);
        throw error;
      }
    };

    export const updateApplicantUser = async ({ id, data, token }) => {
      try {
        const formData = new FormData();
        formData.append('purpose', data.purpose);
        formData.append('car_id', data.car_id);
        if (data.submission_date) {
          formData.append('submission_date', format(data.submission_date, "yyyy-MM-dd'T'HH:mm:ss"));
        }
        
        if (data.expiry_date) {
          formData.append('expiry_date', format(data.expiry_date, "yyyy-MM-dd'T'HH:mm:ss"));
        }

        const response = await fetch(`${BASE_URL}/api/Applicant/update/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        if (!response.ok) {
          const result = await response.text();
          throw new Error(result);
        }
        return await response.json();
      } catch (error) {
        console.log('Error update applicant:', error);
        throw error;
      }
    };

    export const fetchApplicantUserDetail = async ({ token, id }) => {
      try {
        const response = await fetch(`${BASE_URL}/api/Applicant/detail/${id}`, {
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

    // API ADMIN
    export const fetchApplicantAdmin = async ({token ,start_date, end_date, search, status, page, car_id, exportData}) => {
        try {
          const statusParams = status?.map(s => `status[]=${s}`).join('&');
          let carUrl = ""
          if(car_id) {
            carUrl = `&car_id=${car_id}`
          }
          let exportUrl = exportData ? `&export=${exportData}` : '';
            const response = await fetch(`${BASE_URL}/api/data/applicants?search=${search}&start_date=${start_date}&end_date=${end_date}&${statusParams}&page=${page}${carUrl}${exportUrl}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            })
            .then((res) => res.json())
            .then((data) => {
              console.log(data); // Tambahkan ini untuk melihat isi response dari API
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

        export const fetchApplicantAdminDetail = async ({ token, id }) => {
          try {
            const response = await fetch(`${BASE_URL}/api/data/applicants/${id}`, {
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

          export const denyApplicant = async ({ id, token, notes }) => {
            const formData = new FormData();
            formData.append('notes', notes);
          
            const response = await fetch(`${BASE_URL}/api/Applicant/denied/${id}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
              body: formData,
            });
          
            if (!response.ok) {
              throw new Error('Failed to deny applicant');
            }
          
            return await response.json();
          };
          
          

        export const fetchUsers = async ({token, page}) => {
            try {
              const response = await fetch(`${BASE_URL}/api/users?page=${page}`, {
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

          export const createUsers = async ({ data, token, file }) => {
        
            try {
              const formData = new FormData();
              formData.append('FirstName', data.FirstName);
              formData.append('LastName', data.LastName);
              formData.append('email', data.email);
              formData.append('password', data.password);
              formData.append('password_confirmation', data.password_confirmation);
              if (file) {
                formData.append('path', file);
            }
    
          
              const response = await fetch(`${BASE_URL}/api/users/create`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
                body: formData,
              });
          
              if (!response.ok) {
                const result = await response.text();
                console.log(result)
                throw new Error(result);
              }
          
              const result = await response.json();
              return result;
            } catch (error) {
              console.log('Error creating aset:', error);
              throw error;
            }
          };


          export const fetchUsersDetail = async ({token, id}) => {
            try {
              const response = await fetch(`${BASE_URL}/api/users/detail/${id}`, {
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
          }

          export const updateUsers = async ({ id, data, token }) => {
        
            try {
              const formData = new FormData();
              formData.append('FirstName', data.FirstName);
              formData.append('LastName', data.LastName);
              formData.append('email', data.email);
              if (data.password) {
                formData.append('password', data.password);
              }
              if (data.password_confirmation) {
                  formData.append('password_confirmation', data.password_confirmation);
              }
              if (data.path && data.path.length > 0) {
                formData.append('path', data.path[0]);  // Assuming path is an array of files
            }
    
          
              const response = await fetch(`${BASE_URL}/api/users/update/${id}`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
                body: formData,
              });
          
              if (!response.ok) {
                const result = await response.text();
                console.log(result)
                throw new Error(result);
              }
          
              const result = await response.json();
              return result;
            } catch (error) {
              console.error('Error update users:', error);
              throw error;
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