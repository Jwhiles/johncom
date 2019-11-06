module Main exposing (main)

import Blog
import Browser
import Browser.Navigation as Nav
import Html exposing (Html, div, h1, text)
import Platform.Sub as Sub
import Url exposing (Url)


main =
    Browser.application
        { init = init
        , onUrlChange = onUrlChange
        , onUrlRequest = onUrlRequest
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type Model
    = Home
    | Blog Blog.Model


type Msg
    = Msg


onUrlChange : Url -> Msg
onUrlChange url =
    Msg


onUrlRequest : Browser.UrlRequest -> Msg
onUrlRequest urlRequest =
    Msg



-- decode the initial route here?


init : Maybe String -> Url -> Nav.Key -> ( Model, Cmd Msg )
init _ _ _ =
    ( Home
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Browser.Document Msg
view model =
    Browser.Document "Title" <| [ div [] [ h1 [] [ text "welcome to my internet\n    house" ] ] ]
