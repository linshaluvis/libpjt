import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserNavbar from '../usernavbar/usernavbar';
import './OrdersPage.css'; // Import the CSS file
import styled from 'styled-components';


const Container = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: auto;
    background-color: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TableContainer = styled.div`
    width: 100%;
    overflow-x: auto;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    border-radius: 10px;
    overflow: hidden; /* To ensure the rounded corners are respected */
`;

const TableHeader = styled.th`
    background-color: #89253e;
    color: white;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    border: 1px solid #007bff;
`;

const TableData = styled.td`
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
    color: #333;
`;

const Button = styled.button`
    margin-right: 10px;
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9em;
    transition: opacity 0.3s, transform 0.3s;
    &:hover {
        opacity: 0.85;
        transform: scale(1.02);
    }
    &:focus {
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    }
`;
const OrdersPage = () => {
  const [data, setData] = useState([]);
  const baseURL = 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`${baseURL}/userorder/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <UserNavbar />
      <div className="container mt-5">
        <h1 className="text-center text-uppercase text-dark mb-4">My Orders</h1>
        <div className="table-responsive">
        <TableContainer>

          <Table>
            <thead className="thead-dark">
              <tr>
                <TableHeader>ID</TableHeader>
                <TableHeader>Item</TableHeader>
                <TableHeader>Title</TableHeader>
                <TableHeader>Quantity</TableHeader>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <TableData>{index + 1}</TableData>
                  <TableData>
                    <img
                      src={`${baseURL}${item.book.image.url}`}
                      className="order-image"
                      alt={item.book.book}
                    />
                  </TableData>
                  <TableData>{item.book.book}</TableData>
                  <TableData>{item.quantity}</TableData>
                </tr>
              ))}
            </tbody>
          </Table>
          </TableContainer>

        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
