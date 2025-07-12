import {useState, useEffect} from 'react';

function Login(){
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    console.log('Signup Data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" type="text" placeholder="Username" onChange={handleChange} required /><br /><br />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br /><br />
      <button type="submit">Login</button>
    </form>
  );

}
export default Login;