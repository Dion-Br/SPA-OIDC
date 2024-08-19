package authz

default allow_delete = false

allow_delete {
    input.profile.nickname == "test"
}