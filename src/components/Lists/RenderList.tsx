import Card from "../UI/Card";
import React from "react";

const RenderList = ({ posts, onClick }) => {
  return posts.map((post) => (
    <Card
      key={post.id}
      title={post.title}
      liked={post.liked}
      onClick={() => onClick(post.id)}
    />
  ));
};

export default RenderList;
