// import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export default function App() {
  const [users, setUsers] = useState([])
  const [updateData , setUpdateData] = useState(null);
  const notify = (msg, flag) => toast(msg, { type: flag ? "success" : "error" });

  function fetchData() {
    axios.get("http://localhost:5000/user/get-data").then(
      (res) => {
        setUsers(res.data.users);
      }
    ).catch(
      (err) => {
        setUsers([]);
      }
    )
  }

  useEffect(
    () => {
      fetchData();
    }, []
  )

  const SubmitHandler = (e) => {
    e.preventDefault();
    // console.log(e.target);
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      contact: e.target.contact.value
    }
    // console.log(data);
    let API = null;
    if(updateData == null){
    API = axios.post("http://localhost:5000/user/create", data)
    }
    else{
      API = axios.put("http://localhost:5000/user/update/" + updateData._id, data)
    }

    API.then(
      (res) => {
        notify(res.data.msg, res.data.flag)
        if (res.data.flag == 1) {
          fetchData();
          setUpdateData(null);
          e.target.reset(); // Reset the form after successful submission
        }
      }

    ).catch(
      (err) => {
        console.error(err);
      }
    )


  }

  function deleteHandler(id) {
    axios.delete("http://localhost:5000/user/delete/" + id).then(
      (res) => {
        notify(res.data.msg, res.data.flag);
        // if (res.data.flag) {
        fetchData(); // Refresh the user list after deletion
        // }
      }
    ).catch(
      (err) => {
        console.error(err);
      }
    )
  }

  function StatusUpdate(id) {
    axios.patch(`http://localhost:5000/user/update/${id}`).then(
      (res) => {
        notify(res.data.msg, res.data.flag);
        if (res.data.flag === 1) {
          fetchData();

        }
      }
    ).catch(
      (err) => {
        console.error(err);
      }
    )
  }

  return (
    <div className="max-w-fit mx-auto mt-10 p-6 bg-pink-400 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      <ToastContainer />
      {/* Form Section (Static Placeholder) */}
      <form onSubmit={SubmitHandler} className='w-max grid grid-cols-4 gap-4 mb-4'>
        {/* <div className="flex gap-4 mb-4"> */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          defaultValue={updateData?.name}   //here ?. means jab ye function calll ho tb name ki value default me daalna
          className="border p-2 rounded "
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          defaultValue={updateData?.email}
          className="border p-2 rounded  "
        />
        <input
          type="tel"
          name="contact"
          placeholder="Contact no."
          defaultValue={updateData?.contact}
          className="border p-2 rounded"
        />
        <button type='submit' className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition duration-200">
          Submit
        </button>
        {/* </div> */}
      </form>

      {/* Table Section */}
      <table className="table-auto w-max border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Contact</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* sample row */}

          {
            users.map(
              (data, index) => {
                return (
                  <tr key={index}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{data.name}</td>
                    <td className="border px-4 py-2">{data.email}</td>
                    <td className="border px-4 py-2 w-fit">{data.contact}</td>
                    <td className="border px-4 py-2 space-x-2">
                      <button onClick={() => StatusUpdate(data._id)} className={` ${data.status ? "bg-green-400" : "bg-red-500"}  bg-green-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-yellow-600 transition duration-200`}>
                        {
                          data.status ? "Active" : "Inactive"
                        }
                      </button>
                    </td>
                    <td className="border px-4 py-2 space-x-2 flex">
                      <button onClick={() => setUpdateData(data)} className="bg-yellow-400 text-white px-2 py-1 rounded cursor-pointer hover:bg-yellow-500 transition duration-200">
                        Edit
                      </button>
                      <button onClick={() => { deleteHandler(data._id) }} className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-red-600 transition duration-200">
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              }
            )
          }
        </tbody>
      </table>
    </div>
  )
}
