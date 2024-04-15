import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearTweetErrors, fetchTweets, selectAllTweetsArray } from '../../store/tweets';
import TweetBox from './TweetBox';

function Tweets () {
  const dispatch = useDispatch();
  const tweets = useSelector(selectAllTweetsArray);

  useEffect(() => {
    dispatch(fetchTweets());
    return () => dispatch(clearTweetErrors());
  }, [dispatch])

  if (tweets.length === 0) return <div>There are no Tweets</div>;

  return (
    <>
      <h2>All Tweets</h2>
      {tweets.map(tweet => (
        <TweetBox key={tweet._id} tweet={tweet} />
      ))}
    </>
  );
}

export default Tweets;
