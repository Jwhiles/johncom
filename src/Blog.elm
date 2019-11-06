module Blog exposing (Model(..), view)

import Html exposing (Html, a, div, text)
import Route as R


type Model
    = Blogel


view : Model -> Html a
view m =
    div []
        [ a [ R.href R.Home ]
            [ text "take me home" ]
        , text "blorg post"
        ]
