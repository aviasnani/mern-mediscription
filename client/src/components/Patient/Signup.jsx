import {useState, useEffect} from 'react';


function Signup(){
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
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
      <input name="name" type="text" placeholder="Name" onChange={handleChange} required /><br /><br />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br /><br />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br /><br />
      <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required /><br /><br />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;


