export default function UserPosts({posts}) {
  return (
    <>
      <div className="row row-cols-md-3 row-cols-1 border-top">
        {!!posts.length ? (
          posts.map((post) => {
            return (
              <>
                <div className="col align-items-center pt-4 pb-0">
                  <img
                    src={post.image}
                    alt=""
                    className="profile-post img-fluid w-100"
                    id={post.id}
                  />
                </div>
              </>
            );
          })
        ) : (
          <h1>No Posts found</h1>
        )}
      </div>

    </>
  )
}
