package deployer

import (
	"testing"

	"github.com/qiniu/go-sdk/v7/auth"

	"certimate/internal/applicant"
)

func Test_qiuniu_uploadCert(t *testing.T) {
	type fields struct {
		option *DeployerOption
	}
	tests := []struct {
		name    string
		fields  fields
		want    string
		wantErr bool
	}{
		{
			name: "test",
			fields: fields{
				option: &DeployerOption{
					DomainId: "1",
					Domain:   "example.com",
					Product:  "test",
					Access:   `{"bucket":"test","accessKey":"","secretKey":""}`,
					Certificate: applicant.Certificate{
						Certificate: "",
						PrivateKey:  "",
					},
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			q, _ := NewQiNiu(tt.fields.option)
			got, err := q.uploadCert()
			if (err != nil) != tt.wantErr {
				t.Errorf("qiuniu.uploadCert() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("qiuniu.uploadCert() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_qiuniu_modifyDomainCert(t *testing.T) {
	type fields struct {
		option      *DeployerOption
		info        []string
		credentials *auth.Credentials
	}
	type args struct {
		certId string
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		wantErr bool
	}{
		{
			name: "test",
			fields: fields{
				option: &DeployerOption{
					DomainId: "1",
					Domain:   "jt1.ikit.fun",
					Product:  "test",
					Access:   `{"bucket":"test","accessKey":"","secretKey":""}`,
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			q, _ := NewQiNiu(tt.fields.option)
			if err := q.modifyDomainCert(tt.args.certId); (err != nil) != tt.wantErr {
				t.Errorf("qiuniu.modifyDomainCert() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
