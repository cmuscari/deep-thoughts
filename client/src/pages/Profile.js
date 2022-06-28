import React from 'react';
import Auth from '../utils/auth';
import { ADD_FRIEND } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';
import ThoughtForm from '../components/ThoughtForm';

// the useParams hook retrieves the username from the URL, which is then passed to the useQuery hook.  The user object that is created afterwards is used to populate the JSX. This includes passing props to the ThoughtList component to render a list of thoughts unique to this user.
import { Navigate, useParams } from 'react-router-dom';

import ThoughtList from '../components/ThoughtList';

import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';

import FriendList from '../components/FriendList';

const [addFriend] = useMutation(ADD_FRIEND);



const Profile = () => {
  const { username: userParam } = useParams();

  // on component load, the useParams() Hook we use will have a value if it's another user's profile and won't have a value if it's ours. Let's update our useQuery() Hook to check the value of our parameter and conditionally run a query based on the result.
  // Now if there's a value in userParam that we got from the URL bar, we'll use that value to run the QUERY_USER query. If there's no value in userParam, like if we simply visit /profile as a logged-in user, we'll execute the QUERY_ME query instead.
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  // Remember, when we run QUERY_ME, the response will return with our data in the me property; but if it runs QUERY_USER instead, the response will return with our data in the user property. Now we have it set up to check for both.
  const user = data?.me || data?.user || {};

  // navigate to personal profile page if username is the logged-in user's
  // With this, we're checking to see if the user is logged in and if so, if the username stored in the JSON Web Token is the same as the userParam value. If they match, we return the <Navigate> component with the prop to set to the value /profile, which will redirect the user away from this URL and to the /profile route.
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // Now if there is no user data to display, we know that we aren't logged in or at another user's profile page. Instead of redirecting the user away, we simply inform them that they need to be logged in to see this page and they must log in or sign up to use it.
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id }
      });
    } catch (e) {
      console.error(e);
    }
  };

  // With these changes, the userParam variable is only defined when the route includes a username (e.g., /profile/Marisa86). Thus, the button won't display when the route is simply /profile.
  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>
        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
      <div className="mb-3">{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
