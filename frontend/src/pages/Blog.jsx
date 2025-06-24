// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { blog_data } from '../assets/assets';

// const Blog = () => {
//   const { id } = useParams();
//   const [data, setData] = useState(null);

//   const fetchBlogData = async () => {
//     const data = blog_data.find(item => item.id == id);
//     setData(data);
//   };

//   useEffect(() => {
//     fetchBlogData();
//   }, [id]); 

//   return data ? (
//     <div>
//       <h1>Blog</h1>
//     </div>
//   ) : (
//     <div>Loading</div>
//   );
// };

// export default Blog;
