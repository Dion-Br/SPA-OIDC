package policy

default allow = false

allow {
    input.token.valid
    input.request.method == "GET"
}

allow {
    input.token.valid
    input.request.method == "POST"
    input.request.path = ["api", "resource"]
}