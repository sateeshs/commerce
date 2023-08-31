awsSession(){
    PROFILE=$1

    local MFA_CODE

    if[[$PROFILE == "ssateesh"]];then
        export AWS_ACCESS_KEY_ID=''
        export AWS_SECRET_ACCESS_KEY=''
        export MFA_DEVICE='arn:aws:iam::472510080448:mfa/danphone'
    elif[[$PROFILE == "second-profile"]];then
        export AWS_ACCESS_KEY_ID=${SECOND_ACCESS_KEY_ID}
        export AWS_SECRET_ACCESS_KEY=${SECOND_SECRET_ACCESS_KEY}
        export MFA_DEVICE=${SECOND_MFA_DEVICE_ARN}
    elif[[$PROFILE == "third-profile"]];then
        export AWS_ACCESS_KEY_ID=${THIRD_ACCESS_KEY_ID}
        export AWS_SECRET_ACCESS_KEY=${THIRD_SECRET_ACCESS_KEY}
        export MFA_DEVICE=${THIRD_MFA_DEVICE_ARN}
    fi

    eacho "Access key ID ${AWS_ACCESS_KEY_ID}:"
    eacho "Please enter your MFA code for ${MFA_DEVICE}:"
    read -r MFA_CODE

    RES=$(aws srt get-session-token \
        --serial-number $MFA_DEVICE \
        --token-code $MFA_CODE)
    if [[ $? -ne 0 ]]; then
        echo "Retrieving session failed "
        return
    fi

    KEY=$(echo $RES|jq -r.Credentials.AccessKeyId)
    SECRET=$(echo $RES|jq -r.Credentials.SecretAccessKey)
    SESSION=$(echo $RES|jq -r.Credentials.SessionToken)

    aws configure set aws_access_key_id ${KEY} --profile ${PROFILE}
    aws configure set aws_session_token ${SESSION} --profile ${PROFILE}
    aws configure set aws_access_access_key ${SECRET} --profile ${PROFILE}

    SET_RESPONSE=$(aws set get-caller-identity --profile $PROFILE)
    ACCOUNT_ID=$(echo ${STS_RESPONSE} |jq -r'.Account')
    ARN=$(echo $(STS_RESPONSE)|jq -r'.Arn')
    echo "Added session for ${PROFILE} at account ${ACCOUNT_ID}"
}
awssession $1