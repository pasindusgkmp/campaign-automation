import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-0 style={{ margineTop:'-30px'}}">
      <header className="bg-white shadow-sm w-full p-4">
        <h1 className="text-2xl font-bold text-center">Welcome to My App</h1>
        <p className='text-2xl text-red-500 m-0'>automate campaign</p>
        
      </header>
      <img src="" alt=""  className='mb-8 w-full 'style={{maxHeight: ' 60vh'}}/>

      <form action="" className='w-full max-w-md mb-2'>
        <div className='flex items-center justify-center'>
          <input type="email" 
          placeholder=''
          className='flex-grow px-4 py-3 rounded-l border border-gray-300 focus:outline-none focus:border-red-500'
          />
          <button
            type='submit'
            className='px-6 py-3 bg-red-500 text-white rounded-r hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
export default Home;