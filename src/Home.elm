module Home exposing (view)

import BlogPosts
import Html exposing (Html, a, div, h1, h2, li, ol, text)
import Route as R


view : Html msg
view =
    div [] <|
        [ h1 [] [ text "John's internet house" ]
        , recentBlogPosts
        ]


recentBlogPosts : Html msg
recentBlogPosts =
    div [] <|
        [ h2 []
            [ text "recent posts" ]
        , ol [] <|
            List.map
                (\bp ->
                    li []
                        [ a [ R.href <| R.BlogPost (R.Slug bp) ]
                            [ text bp
                            ]
                        ]
                )
            <|
                List.take 3 BlogPosts.blogIndex
        , a [ R.href <| R.BlogIndex ] [ text "See more blog posts" ]
        ]
