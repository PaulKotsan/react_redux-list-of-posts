import React, { useEffect } from 'react';
import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { Post } from './types/Post';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  postsAsync,
  postsHasError,
  postsList,
  postsLoaded,
} from './features/posts/postsSlice';
import { authorAsync, authorUser } from './features/author/authorSlice';
import { User } from './types/User';
import {
  selectedPost,
  setSelectedPost,
} from './features/selectedPost/selectedPostSlice';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const posts = useAppSelector(postsList);
  const selectedPostValue = useAppSelector(selectedPost);
  const loaded = useAppSelector(postsLoaded);
  const hasError = useAppSelector(postsHasError);
  const author = useAppSelector(authorUser);

  // Moved from React useState.
  function setAuthor(user: User) {
    // Pass user id to fetch
    dispatch(authorAsync(user.id));
  }

  function handlePostSelect(post: Post | null) {
    dispatch(setSelectedPost(post));
  }

  function loadUserPosts(userId: number) {
    dispatch(postsAsync(userId));
  }

  useEffect(() => {
    // we clear the post when an author is changed
    // not to confuse the user
    handlePostSelect(null);

    if (author) {
      loadUserPosts(author.id);
    }
  }, [author, dispatch]);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector value={author} onChange={setAuthor} />
              </div>

              <div className="block" data-cy="MainContent">
                {!author && <p data-cy="NoSelectedUser">No user selected</p>}

                {author && !loaded && <Loader />}

                {author && loaded && hasError && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {author && loaded && !hasError && posts.length === 0 && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}

                {author && loaded && !hasError && posts.length > 0 && (
                  <PostsList
                    posts={posts}
                    selectedPostId={selectedPostValue?.id}
                    onPostSelected={handlePostSelect}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': selectedPostValue,
              },
            )}
          >
            <div className="tile is-child box is-success ">
              {selectedPostValue && <PostDetails post={selectedPostValue} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
