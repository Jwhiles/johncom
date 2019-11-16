module Home exposing (view)

import BlogIndex
import BlogPosts
import Html exposing (Html, a, div, h1, h2, text)
import Html.Attributes as A
import Route as R


view : ( String, Html msg )
view =
    let
        body =
            div [ A.class "siteBody" ] <|
                [ h1 [] [ text "John's internet house" ]
                , recentBlogPosts
                ]
    in
    ( "John Whiles' internet house", body )


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
