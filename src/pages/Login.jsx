import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { Link } from 'react-router-dom';
import {
  setDoc,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [isEmailTaken, setisEmailTaken] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [isNoAccountExists, setIsNoAccountExists] = useState(false);
  let navigate = useNavigate();

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const colRef = collection(db, 'users');
    const q = query(colRef, where('uid', '==', `${user.uid}`));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setIsNoAccountExists(true);
      signOut(auth);
    } else {
      navigate('/');
    }
  };

  const signUp = async e => {
    e.preventDefault();
    const docRef = doc(db, 'users', username.toLowerCase());
    const userDoc = await getDoc(docRef);
    if (!!userDoc.data()) {
      setIsUsernameTaken(true);
      return;
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const colRef = collection(db, 'users');
    const q = query(colRef, where('email', '==', user.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setisEmailTaken(true);
      return;
    }
    await setDoc(docRef, {
      displayName: user.displayName,
      photo: user.photoURL,
      uid: user.uid,
      email: user.email,
      posts: [],
      followers: [],
      following: [],
      username: username
    });
    navigate('/');
  };

  return (
    <div className='container-fluid row d-flex flex-row justify-content-center border login-container'>
      <div className='col-4 '>
        <img
          className='img-fluid'
          src='https://firebasestorage.googleapis.com/v0/b/instagram-clone-63cff.appspot.com/o/Instagram001-2-removebg-preview.png?alt=media&token=689f7e76-b532-4145-9195-a502ceb66c15'
          alt='Splash'
        />
      </div>
      <div className='card col-4 '>
        <h5 className='text-center py-3 fs-2 fs-bold'>Instagram</h5>
        <div className='card-body'>
          <div className='login'>
            <form onSubmit={signUp} className='form'>
              <input
                name='username'
                id='username'
                type='text'
                className='form-control my-2'
                placeholder='Enter username'
                required
                pattern='[a-zA-Z][a-zA-Z0-9_]{3,20}'
                onChange={e => {
                  setUsername(e.target.value);
                  setIsUsernameTaken(false);
                  setisEmailTaken(false);
                  setIsNoAccountExists(false);
                }}
              />
              <div class='d-grid gap-2'>
                <input
                  className='btn btn-primary'
                  type='submit'
                  value={'Sign Up with Google'}
                />
              </div>
              <p className='text-danger'>
                {isEmailTaken && 'Email already taken'}
              </p>
              <p className='text-danger'>
                {isUsernameTaken && 'Username already taken'}
              </p>
              <p className='text-danger'>
                {isNoAccountExists && 'account not registered'}
              </p>
            </form>
            <p className='text-center'>
              Already Have an Account?{' '}
              <span className='link-secondary'>
                <Link
                  to='/login'
                  className='text-decoration-none link-secondary'
                  onClick={googleLogin}
                >
                  Login
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
