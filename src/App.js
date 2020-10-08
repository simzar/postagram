import React, {useEffect, useState} from "react";
import {HashRouter, Route, Switch} from "react-router-dom";
import {AmplifySignOut, withAuthenticator} from '@aws-amplify/ui-react';
import {css} from 'emotion';
import {API, Auth, Storage} from 'aws-amplify';
import {listPosts} from './graphql/queries';

import Posts from './containers/Posts';
import Post from './containers/Post';
import Header from './components/Header';
import CreatePost from './components/CreatePost';
import Button from './components/Button';

const initialState = {
  // formState: 'signUp',
  formState: 'signedIn',
  username: '',
  password: '',
  email: '',
  authCode: '',
};

function Router() {
  // playing around with custom auth
  const [state, setState] = useState(initialState);

  /* create a couple of pieces of initial state */
  const [showOverlay, updateOverlayVisibility] = useState(false);
  const [posts, updatePosts] = useState([]);
  const [myPosts, updateMyPosts] = useState([]);

  /* fetch posts when component loads */
  useEffect(() => {
    fetchPosts();
  }, []);
  async function fetchPosts() {
    /* query the API, ask for 100 items */
    let postData = await API.graphql({ query: listPosts, variables: { limit: 100 }});
    let postsArray = postData.data.listPosts.items;
    /* map over the image keys in the posts array, get signed image URLs for each image */
    postsArray = await Promise.all(postsArray.map(async post => {
      post.image = await Storage.get(post.image);
      return post;
    }));
    /* update the posts array in the local state */
    setPostState(postsArray);
  }

  async function setPostState(postsArray) {
    const user = await Auth.currentAuthenticatedUser();
    const myPostData = postsArray.filter(p => p.owner === user.username);
    updateMyPosts(myPostData);
    updatePosts(postsArray);
  }

  // further playing with custom auth
  // const { formState, authCode, email, password, username } = state;
  const { formState } = state;
  // const onChange = (e) => {
  //   e.persist();
  //   setState(() => ({ ...state, [e.target.name]: e.target.value }))
  // }
  //
  // const signUp = async () => {
  //   try {
  //     await Auth.signUp({ username, password, attributes: { email } });
  //     setState({ ...state, formState: 'confirmSignUp' });
  //   } catch (e) {
  //     console.error('uh oh: ', e);
  //   }
  // };
  //
  // const confirmSignUp = async () => {
  //   try {
  //     await Auth.confirmSignUp(username, authCode);
  //     setState({ ...state, formState: 'signIn' });
  //   } catch (e) {
  //     console.error('uh oh: ', e);
  //   }
  // };
  //
  // const signIn = async () => {
  //   try {
  //     await Auth.signIn(username, password);
  //     setState({ ...state, formState: 'signedIn' });
  //   } catch (e) {
  //     console.error('uh oh: ', e);
  //   }
  // };
  //
  // const signOut = async () => {
  //   try {
  //     await Auth.signOut();
  //     setState({ ...state, formState: 'signIn' });
  //   } catch (e) {
  //     console.error('uh oh: ', e);
  //   }
  // };

  return (
      <>
        {/*{ formState === 'signUp' && (*/}
        {/*    <div>*/}
        {/*      <input name="username" placeholder="Username" onChange={onChange} />*/}
        {/*      <input name="password" placeholder="Password" type="password" onChange={onChange} />*/}
        {/*      <input name="email" placeholder="Email" type="email" onChange={onChange} />*/}
        {/*      <button onClick={signUp}>Sign Up</button>*/}
        {/*      <button onClick={() => setState({...state, formState: 'signIn'})}>Sign In</button>*/}
        {/*    </div>*/}
        {/*) }*/}
        {/*{ formState === 'confirmSignUp' && (*/}
        {/*    <div>*/}
        {/*      <input name="username" value={username} disabled />*/}
        {/*      <input name="authCode" placeholder="Auth Code" onChange={onChange} />*/}
        {/*      <button onClick={confirmSignUp}>Confirm Sign Up</button>*/}
        {/*    </div>*/}
        {/*) }*/}
        {/*{ formState === 'signIn' && (*/}
        {/*    <div>*/}
        {/*      <input name="username" placeholder="Username" onChange={onChange} />*/}
        {/*      <input name="password" placeholder="Password" type="password" onChange={onChange} />*/}
        {/*      <button onClick={() => setState({...state, formState: 'signUp'})}>Sign Up</button>*/}
        {/*      <button onClick={signIn}>Sign In</button>*/}
        {/*    </div>*/}
        {/*) }*/}
        { formState === 'signedIn' && (
            <HashRouter>
              <div className={contentStyle}>
                <Header />
                {/*<button onClick={signOut}>Sign Out</button>*/}
                <hr className={dividerStyle} />
                <Button title="New Post" onClick={() => updateOverlayVisibility(true)} />
                <Switch>
                  <Route exact path="/" >
                    <Posts posts={posts} />
                  </Route>
                  <Route path="/post/:id" >
                    <Post />
                  </Route>
                  <Route exact path="/myposts" >
                    <Posts posts={myPosts} />
                  </Route>
                </Switch>
              </div>
              <AmplifySignOut />
            </HashRouter>
        ) }
        { showOverlay && (
            <CreatePost
                updateOverlayVisibility={updateOverlayVisibility}
                updatePosts={setPostState}
                posts={posts}
            />
        )}
      </>
  );
}

const dividerStyle = css`
  margin-top: 15px;
`

const contentStyle = css`
  min-height: calc(100vh - 45px);
  padding: 0px 40px;
`

export default withAuthenticator(Router);
// export default Router;
