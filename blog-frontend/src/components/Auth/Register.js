import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from '../../api';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    bio: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().min(6, 'Password should be at least 6 characters long').required('Required'),
    bio: Yup.string().required('Required'), 
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('http://localhost:5227/api/users/register', {
        username: values.username,
        email: values.email,
        password: values.password,
        bio: values.bio,
      });

      console.log(response.data);
      setSubmitting(false);

      navigate('/login');
    } catch (error) {
      console.error('Register error', error);
      setErrors({ api: 'Registration failed, please try again' });
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting, errors }) => (
          <Form className="register-form">
            <div className="form-control">
              <label htmlFor="username">Username</label>
              <Field type="text" id="username" name="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            <div className="form-control">
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-control">
              <label htmlFor="password">Password</label>
              <Field type="password" id="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div className="form-control">
              <label htmlFor="bio">Bio</label>
              <Field type="text" id="bio" name="bio" />
              <ErrorMessage name="bio" component="div" className="error" />
            </div>

            {errors.api && <div className="error">{errors.api}</div>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;