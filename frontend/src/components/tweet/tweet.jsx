const Tweet = ({ data }) => {
    const {
        id,
        user: {
            at,
            name,
            is_profile_public,
            is_blue
        },
        timestamp,
        has_media,
        has_poll,
        content,
        likes_amount,
        retweets_amount,
        replies_amount
    } = data;

    return (
        <div className="tweet">
            <h2>{name} ({at})</h2>
            <p>{content}</p>
            <p>{likes_amount} likes, {retweets_amount} retweets, {replies_amount} replies</p>
            <p>{timestamp}</p>
            <p>Media: {has_media ? 'Yes' : 'No'}</p>
            <p>Poll: {has_poll ? 'Yes' : 'No'}</p>
            <p>Profile Public: {is_profile_public ? 'Yes' : 'No'}</p>
            <p>Verified: {is_blue ? 'Yes' : 'No'}</p>
        </div>
    )
}

export default Tweet;