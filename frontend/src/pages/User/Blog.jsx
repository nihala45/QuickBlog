import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { blog_data, assets, comments_data } from '../../assets/assets';
import Navbar from '../../components/User/Navbar';
import Moment from 'moment';
import Footer from '../../components/User/Footer'
import Loader from '../../components/User/Loader'
const Blog = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const addCommment = async (e) => {
    e.preventDefault();
    const newComment = {
      name,
      content,
      createdAt: new Date(),
    };
    setComments([...comments, newComment]);
    setName('');
    setContent('');
  };

  const fetchBlogData = async () => {
    const data = blog_data.find(item => item._id === id);
    setData(data);
  };

  const fetchComments = async () => {
    setComments(comments_data);
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, [id]);

  return data ? (
    <div>
      <Navbar />
      <div className="relative">
        <img
          src={assets.gradientBackground}
          alt=""
          className="absolute -top-[200px] -z-10 opacity-50"
        />

        <div className="text-center mt-20 text-gray-600">
          <p className="text-primary py-4 font-medium">
            Published on {Moment(data.createdAt).format('MMM Do YYYY')}
          </p>
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
            {data.title}
          </h1>
          <h2 className="my-5 max-w-lg truncate mx-auto">{data.subTitle}</h2>
          <p className="inline-block py-1 px-4 rounded-full mb-5 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
            Micheal hello
          </p>
        </div>
      </div>

      <div className="mx-5 max-w-5xl md:mx-auto my-10">
        <img src={data.image} alt="" className="rounded-3xl mb-5 w-full" />

        <div
          className="rich-text max-w-3xl mx-auto text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />

        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold mb-4 text-lg">Comments ({comments.length})</p>
          <div className="flex flex-col gap-6">
            {comments.map((item, index) => (
              <div
                key={index}
                className="relative bg-white shadow-md border border-gray-200 max-w-xl p-4 rounded-md text-gray-700"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img src={assets.user_icon} alt="" className="w-8 h-8 rounded-full" />
                  <p className="font-semibold text-base">{item.name}</p>
                </div>
                <p className="text-sm ml-11">{item.content}</p>
                <div className="absolute right-4 bottom-3 text-xs text-gray-400">
                  {Moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-12">
          <p className="font-semibold mb-4 text-lg">Add Your Comment</p>
          <form onSubmit={addCommment} className="flex flex-col gap-4 max-w-xl">
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Your Name"
              required
              className="w-full p-3 border border-gray-300 rounded-md outline-none"
            />
            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="Write your comment here..."
              required
              className="w-full p-3 border border-gray-300 rounded-md outline-none h-24 resize-none"
            />
            <button
              type="submit"
              className="bg-primary text-white rounded-md px-6 py-2 hover:scale-105 transition-transform"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="my-24 max-w-3xl mx-auto">
          <p className="font-semibold mb-4 text-lg">Share this article on social media</p>
          <div className="flex gap-5">
            <img src={assets.facebook_icon} width={40} alt="Facebook" />
            <img src={assets.twitter_icon} width={40} alt="Twitter" />
            <img src={assets.googleplus_icon} width={40} alt="Google Plus" />
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  ) : (
    <Loader/>
  );
};

export default Blog;
