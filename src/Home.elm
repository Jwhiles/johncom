module Home exposing (view)

import BlogIndex
import BlogPosts
import Html exposing (Html, a, div, h1, h2, text)
import Html.Attributes as A
import Route as R


view : Html msg
view =
    div [ A.class "siteBody" ] <|
        [ h1 [] [ text "John's internet house" ]
        , recentBlogPosts
        ]


recentBlogPosts : Html msg
recentBlogPosts =
    div [] <|
        [ h2 []
            [ text "Recent blog posts" ]
        , BlogIndex.homeBlogList <|
            List.take
                3
                BlogPosts.blogIndex
        , a [ A.class "bigLink", R.href <| R.BlogIndex Nothing ] [ text "See more blog posts" ]
        ]
