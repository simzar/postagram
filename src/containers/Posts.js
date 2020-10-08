import React from 'react'
import { css } from 'emotion';
import { Link } from 'react-router-dom';

export default function Posts({
                                  posts = []
                              }) {
    return (
        <>
            <h1>Posts</h1>
            <div className={postsContainer}>
            {
                posts.map(post => (
                    <Link to={`/post/${post.id}`} className={linkStyle} key={post.id}>
                        <div key={post.id} className={postContainer}>
                            <h1 className={postTitleStyle}>{post.name}</h1>
                            <img alt="post" className={imageStyle} src={post.image} />
                        </div>
                    </Link>
                ))
            }
            </div>
        </>
    )
}

const postTitleStyle = css`
  margin: 15px 0px;
  color: #0070f3;
`

const linkStyle = css`
  text-decoration: none;
`

const postsContainer = css`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
`;

const postContainer = css`
  border-radius: 10px;
  padding: 1px 20px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
  min-width: 30%;
  margin: 5px;
  :hover {
    border-color: #0070f3;
  }
`

const imageStyle = css`
  width: 100%;
  max-width: 400px;
`
